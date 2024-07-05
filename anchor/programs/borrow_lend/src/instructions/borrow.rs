use anchor_lang::prelude::*;
use crate::state::UserAcc;
use crate::state::{BorrowedToken, LendedToken};
use crate::error::BLErrorCode;
use crate::constants::{USER_SEED, BORROW_PERCENTAGE, TOKENS};

pub fn borrow(ctx: Context<Borrow>, borrow: BorrowedToken) -> Result<()> 
{
    let user = &mut ctx.accounts.user;

    //Get amount of the total lended tokens in USD
    let mut total_lended_amount_in_usd = 0;
    for n in &user.lended_tokens
    {
        total_lended_amount_in_usd += n.amount * TOKENS.binary_search_by(|(k, _)| k.cmp(&n.token.to_string().as_str())).map(|x| TOKENS[x].1).ok().unwrap();   //Get the real token price from Pyth
    }

    //Get amount of the total borrowed tokens in USD
    let mut total_borrow_amount_in_usd = 0;
    
    for n in &user.borrowed_tokens
    {
        total_borrow_amount_in_usd += n.amount * TOKENS.binary_search_by(|(k, _)| k.cmp(&n.token.to_string().as_str())).map(|x| TOKENS[x].1).ok().unwrap(); //Get the real token price from Pyth
    }

    total_borrow_amount_in_usd += borrow.amount * TOKENS.binary_search_by(|(k, _)| k.cmp(&borrow.token.to_string().as_str())).map(|x| TOKENS[x].1).ok().unwrap(); //Add current borrow amount

    require!(total_borrow_amount_in_usd <= (total_lended_amount_in_usd / 100) * BORROW_PERCENTAGE, BLErrorCode::BorrowHigherThanLend);

    user.borrowed_tokens.push(borrow);

    Ok(())
}

#[derive(Accounts)]
pub struct Borrow<'info>
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
