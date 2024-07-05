use anchor_lang::prelude::*;
use crate::state::{borrowed_tokens::BorrowedToken, lended_tokens::LendedToken};

#[account]
pub struct UserAcc
{
    pub authority: Pubkey,
    pub lended_tokens: Vec<LendedToken>,
    pub borrowed_tokens: Vec<BorrowedToken>,
}

impl UserAcc
{
    pub const LEN: usize = 32 + 4 + 4;
}