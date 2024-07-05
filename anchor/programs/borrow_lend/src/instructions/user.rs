use anchor_lang::prelude::*;
use crate::state::UserAcc;
use crate::constants::USER_SEED;

pub fn init_user(ctx: Context<UserInit>) -> Result<()> 
{
    let user = &mut ctx.accounts.user;

    user.authority = ctx.accounts.signer.key();
    user.borrowed_tokens = Vec::new();
    user.lended_tokens = Vec::new();

    Ok(())
}

#[derive(Accounts)]
pub struct UserInit<'info>
{
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, seeds=[USER_SEED, signer.key().as_ref()], bump, space = 8 + UserAcc::LEN)]
    pub user: Account<'info, UserAcc>,

    pub system_program: Program<'info, System>
}