
use fabric_contract;

#[derive(Debug)]
pub struct MyContract {

}

impl Contract for MyContract {

    fn name(&self) -> String {
        format!("MyContract")
    }

    fn before_transaction(&self,_ctx: &Context)  {
        println!("MyContract Befosdsre Tranasction");
    }
}

impl MyContract {

    pub fn my_first_transaction(&self, _ctx: &Context, arg: String) -> String {
        
        let s = format!("my_first_transaction::{}",arg);
        s
    }
}