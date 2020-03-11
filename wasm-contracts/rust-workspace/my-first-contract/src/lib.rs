
use contractapi::Context;



#[derive(Debug)]
pub struct MyContract {

}

impl contractapi::Contract for MyContract {

    fn name(&self) -> String {
        format!("MyContract")
    }

    fn before_transaction(&self,_ctx: &Context)  {
        println!("MyContract Befosdsre Tranasction");
    }
}

impl MyContract {

    pub fn my_first_transaction(&self, _ctx: &Context, arg: String) -> Vec<u8> {
        
        let s = format!("my_first_transaction::{}",arg);
        s.as_bytes().to_vec()
    }
}