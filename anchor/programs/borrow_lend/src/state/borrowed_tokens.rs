use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BorrowedToken
{
    pub token: Pubkey,
    pub amount: u64
}

impl BorrowedToken
{
    pub const LEN: usize = 32 + 8;
}