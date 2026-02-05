const { REPL_MODE_SLOPPY } = require("node:repl");

module.exports = cds.service.impl( async function(){
    // Step -- 1 : Get the object from ODATA Entities
    let { EmployeService, PurchaseOrderS} = this.entities ;


    // Step -- 2 : Define generic handler for the pre-checks
    this.before('UPDATE', EmployeService, (request, response) => {
        console.log("Salary ",request.data.salary);
        if(parseFloat(request.data.salary) >= 50000){
            request.error(500,"Please get the apporval from your line manager");
        }
    });
    // Update Implementation of the Function
this.on('getEmployeeInfo', async(request, response) => {
    try{
const transaction = cds.tx(request);
const reply = transaction.read(EmployeService).orderBy({
    salary:'desc'
}).limit(10);
return reply;
    }
    catch(error){
return "Error: " + error.toString();
    }
});

//update
this.on('createEmployee', async(request, response) => {
        const dataset = request.data ;


        let returndata = await cds.tx(request).run([
            INSERT.into(EmployeeService).entries(dataset)
        ]).then((resolve, reject)=>{
            if (typeof(resolve) !== undefined) {
                return request.data;
            } else {
                request.error(500, "Error in creation of Employee");
            }
        }).catch(err => {
            request.error(500, "There is an error : " + error.toString());
        });


        return returndata;
    })


        this.on('discountPrice', async(request, response) =>{
        try {
            const ID = request.params[0];


            const transaction = cds.tx(request);


            await transaction.update(PurchaseOrderS).with({
                GROSS_AMOUNT : { '-=' : 1000 },
                NET_AMOUNT : { '-=' : 800 },
                TAX_AMOUNT : { '-=' : 200 }
            }).where(ID)




        } catch (error) {
            return "Error : " + error.toString();
        }
    });


    this.on('largetOrder', async(request, response) => {


        try {
            const transaction = cds.tx(request);


            const reply = await transaction.read(PurchaseOrderS).orderBy({
                GROSS_AMOUNT : 'desc'
            }).limit(1);


            return reply ;
        } catch (error) {
            return "Error : " + error.toString();
        }
    })






})
