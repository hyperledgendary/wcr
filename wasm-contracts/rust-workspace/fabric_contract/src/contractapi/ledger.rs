


#[derive(Debug)]
pub struct Context {
    tx_id: std::string::String,
}

impl Context {
    pub fn new() -> Context {
        Context {
            tx_id: "01234567890".to_string(),
        }
    }

    pub fn create_state(&mut self, key: String, data: Vec<u8>) {
        println!("[createState] {}  {:?}", key, data);
    }

    pub fn retrieve_state(&mut self, key: String) -> Vec<u8> {
        println!("[retrieveState] {} ", key);
        b"data".to_vec()
    }

    pub fn get_txid(&mut self) -> &std::string::String {
        return &self.tx_id;
    }
}
