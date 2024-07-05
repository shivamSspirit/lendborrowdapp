use anchor_lang::prelude::*;

#[error_code]
pub enum BLErrorCode 
{
    #[msg("Borrow amount Higher than Lend Amount")]
    BorrowHigherThanLend
}