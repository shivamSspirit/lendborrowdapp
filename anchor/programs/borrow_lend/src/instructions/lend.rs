use anchor_lang::prelude::*;
use crate::state::UserAcc;
use crate::state::{BorrowedToken, LendedToken};
use crate::constants::USER_SEED;

pub fn lend(ctx: Context<Lend>, lend: LendedToken) -> Result<()> 
{
    let user = &mut ctx.accounts.user;

    user.lended_tokens.push(lend);

    Ok(())
}

#[derive(Accounts)]
pub struct Lend<'info>
{
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds=[USER_SEED, signer.key().as_ref()],
        bump,
        realloc = 8 + UserAcc::LEN + ((user.borrowed_tokens.len() + 1) * BorrowedToken::LEN) + ((user.lended_tokens.len() + 1) * LendedToken::LEN),
        realloc::payer = signer,
        realloc::zero = true)
    ]
    pub user: Account<'info, UserAcc>,

    pub system_program: Program<'info, System>
}