import type { DecodedTxRaw } from '@cosmjs/proto-signing'

export type Block = {
  header: {
    height: number;
    time: string;
    chain_id: string;
    proposer_address: string;
  },
  data: {
    txs: Array<Uint8Array>;
  }
}

export type Transaction = {
  height: number;
  hash: string;
  tx: DecodedTxRaw;
}

export type Validator = {
  description: {
    moniker: string;
  },
  status: string;
  delegator_shares: number;
  commission: {
    commission_rates: {
      rate: number;
    }
  };
  consensus_pubkey: {
    '@type': string;
    key: string;
  }
}

export type Proposal = {
  id: number;
  title: string;
  status: string;
  voting_end_time: string;
  messages: Array<{
    content: {
      '@type': string;
    }
  }>
}