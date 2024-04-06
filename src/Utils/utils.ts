import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fromBase64, toHex } from '@cosmjs/encoding';
import { Ripemd160, sha256 } from '@cosmjs/crypto';
import type { Validator } from '../App';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

function consensusPubkeyToHexAddress(consensusPubkey?: {
  '@type': string;
  key: string;
}) {
  if (!consensusPubkey) {
    return '';
  }

  if (consensusPubkey['@type'] === '/cosmos.crypto.ed25519.PubKey') {
    const pubkey = fromBase64(consensusPubkey.key);
    if (pubkey) {
      return toHex(sha256(pubkey)).slice(0, 40).toUpperCase();
    }
  }

  if (consensusPubkey['@type'] === '/cosmos.crypto.secp256k1.PubKey') {
    const pubkey = fromBase64(consensusPubkey.key);
    if (pubkey) {
      return toHex(new Ripemd160().update(sha256(pubkey)).digest());
    }
  }

  return '';
}

function formatValidator(address: string, validators: Array<Validator>) {
  if (!address) return address;

  const hexAddress = toHex(fromBase64(address)).toUpperCase();
  const validator = validators.find(
    (x) => consensusPubkeyToHexAddress(x.consensus_pubkey) === hexAddress
  );
  return validator?.description?.moniker;
}

function formatTimestamp(timestamp: string): string {
  return dayjs(timestamp).fromNow()
}

function formatTime(timestamp: string): string {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

function formatPercentage(number: number): string {
  return (number * 100).toFixed(2) + '%';
}

function formatNumber(number: number): string {
  return number.toLocaleString();
}

function formatMessage(msgs: { '@type'?: string; typeUrl?: string }[]){
  if (msgs) {
    const sum: Record<string, number> = msgs.reduce((s: Record<string, number>, msg) => {
      const msgType = msg['@type'] || msg.typeUrl || 'unknown';
      const messageType = msgType.substring(msgType.lastIndexOf('.') + 1).replace('Msg', '');
      s[messageType] = (s[messageType] || 0) + 1;
      return s;
    }, {});

    const output: string[] = Object.keys(sum).map((k) => {
      return sum[k] > 1 ? `${k}×${sum[k]}` : k;
    });

    return output.join(', ');
  }
}

function hashTx(raw: Uint8Array) {
  return toHex(sha256(raw)).toUpperCase();
}

function formatTokens(
  tokens?: { denom: string; amount: string }[],
): string {
  if (!tokens) return '';
  return tokens.map((x) => formatToken(x)).join(', ');
}

function formatToken(token: { denom: string; amount: string }){
  let amount = 0
  if (token.denom === 'uatom') {
    amount = Number(token.amount) / Math.pow(10, 6);
  }
  return amount + ' ATOM'; 
}

function formatValidatorStatus(status: string) {
  return status.replace('BOND_STATUS_', '');
}

export {
  formatValidator,
  formatTimestamp,
  formatTime,
  formatPercentage,
  formatNumber,
  formatMessage,
  formatTokens,
  hashTx,
  formatValidatorStatus
};