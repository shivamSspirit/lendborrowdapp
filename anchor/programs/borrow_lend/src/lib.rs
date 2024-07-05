mod error;
mod constants;
pub mod state;
pub use state::*;
pub mod instructions;
pub use instructions::*;
use anchor_lang::prelude::*;

declare_id!("FqfKDfzgDaf4JsEaP5eDX9qEedUPdfdv8uCcQDv4LszL");

#[program]
pub mod borrow_lend {
    use super::*;

    pub fn init_user_main(ctx: Context<UserInit>) -> Result<()> 
    {
        user::init_user(ctx)
    }

    pub fn lend_main(ctx: Context<Lend>, lend: LendedToken) -> Result<()> 
    {
        lend::lend(ctx, lend)
    }

    pub fn borrow_main(ctx: Context<Borrow>, lend: BorrowedToken) -> Result<()> 
    {
        borrow::borrow(ctx, lend)
    }
}