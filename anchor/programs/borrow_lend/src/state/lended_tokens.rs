use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LendedToken
{
    pub token: Pubkey,
    pub amount: u64
}

impl LendedToken
{
    pub const LEN: usize = 32 + 8;
}