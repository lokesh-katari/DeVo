use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, Token, TokenAccount};


declare_id!("3XZiTiynjiHNWwNjp5z6qHFpoMN6FtYoiR92qMBztd7v");
/// CHECK:
#[program]
pub mod voting_app {
    use super::*;
    use anchor_spl::token;
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        proposal.creator = ctx.accounts.creator.key();
        proposal.title = title;
        proposal.description = description;
        proposal.votes_for = 0;
        proposal.votes_against = 0;
        proposal.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn vote(
        ctx: Context<VoteOnProposal>,
        vote_for: bool,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let vote_record = &mut ctx.accounts.vote_record;
        let voter = &ctx.accounts.voter;

        // Check if the voter owns the required NFT
        require!(
            ctx.accounts.nft_token_account.amount > 0,
            VotingError::NoNftOwnership
        );

        // Ensure the voter hasn't already voted on this proposal
        require!(
            !vote_record.has_voted,
            VotingError::AlreadyVoted
        );

        if vote_for {
            proposal.votes_for += 1;
        } else {
            proposal.votes_against += 1;
        }

        vote_record.has_voted = true;
        vote_record.voter = voter.key();
        vote_record.proposal = proposal.key();

             // Distribute governance tokens as a reward for voting
             let cpi_accounts = token::MintTo {
                mint: ctx.accounts.governance_token_mint.to_account_info(),
                to: ctx
                    .accounts
                    .voter_governance_token_account
                    .to_account_info(),
                authority: ctx
                    .accounts
                    .governance_token_mint_authority
                    .to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            token::mint_to(cpi_ctx, 1)?;
            Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 4 + title.len() + 4 + description.len() + 8 + 8 + 8,
        seeds = [b"proposal", creator.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoteOnProposal<'info> {
    #[account(mut, seeds = [b"proposal", proposal.creator.as_ref(), proposal.title.as_bytes()], bump)]
    pub proposal: Account<'info, Proposal>,
    #[account(
        init_if_needed,
        payer = voter,
        space = 8 + 32 + 32 + 1,
        seeds = [b"vote_record", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        constraint = nft_token_account.owner == voter.key(),
        constraint = nft_token_account.mint == nft_mint.key(),
    )]
    pub nft_token_account: Account<'info, TokenAccount>,
    pub nft_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    
    #[account(mut)]
    pub governance_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub voter_governance_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub governance_token_mint_authority: Signer<'info>,
}

#[account]
pub struct Proposal {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub votes_for: u64,
    pub votes_against: u64,
    pub created_at: i64,
}

#[account]
pub struct VoteRecord {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub has_voted: bool,
}

#[error_code]
pub enum VotingError {
    #[msg("The voter does not own the required NFT.")]
    NoNftOwnership,
    #[msg("The voter has already voted on this proposal.")]
    AlreadyVoted,
}