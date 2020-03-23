extern crate  proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_attribute]
pub fn HelloMacro(attr: TokenStream, item: TokenStream) -> TokenStream {
    let mut output = item.clone();
    println!("attr: \"{}\"", attr.to_string());
    println!("item: \"{}\"", item.to_string());


    let input = syn::parse_macro_input!(item as syn::ItemFn);
    let name = &input.sig;
    

    let code = quote! {
        pub fn hello() {println!("gello");}
    };

    output.extend(TokenStream::from(code));
    output
}

// fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
//     let name = &ast.ident;
//     let gen = quote! {
//         // impl HelloMacro for #name {
//         //     fn hello_macro() {
//         //         println!("Hello Macro!  My name is {}!",stringify!(#name))
//         //     }
//         // }
//     };
//     gen.into()
// }