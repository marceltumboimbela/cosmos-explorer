import { FC, useState, Fragment } from "react";
import type { Proposal } from "../../types";
import { formatTime } from "../../Utils";

type ProposalsProps = {
  proposals: Array<Proposal>;
}

function formatProposal(name: string) {
  if (name) {
    return name.substring(name.lastIndexOf('.') + 1);
  }
  return name;
}

function formatStatus(status: string) {
  return status.replace('PROPOSAL_STATUS_', '');
}

enum stat {
  PASSED = 'PROPOSAL_STATUS_PASSED',
  REJECTED = 'PROPOSAL_STATUS_REJECTED',
  VOTING = 'PROPOSAL_STATUS_VOTING_PERIOD'
}

const Proposals: FC<ProposalsProps> = ({ proposals }) => {

  const [status, setStatus] = useState(stat.VOTING);

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button className={`px-2 py-1 border-2 border-gray-500 rounded ${status === stat.VOTING ? 'bg-blue-500 text-white' : ''}`} onClick={() => setStatus(stat.VOTING)}>VOTING</button>
        <button className={`px-2 py-1 border-2 border-gray-500 rounded ${status === stat.PASSED ? 'bg-blue-500 text-white' : ''}`} onClick={() => setStatus(stat.PASSED)}>PASSED</button>
        <button className={`px-2 py-1 border-2 border-gray-500 rounded ${status === stat.REJECTED ? 'bg-blue-500 text-white' : ''}`} onClick={() => setStatus(stat.REJECTED)}>REJECTED</button>
      </div>

      <div className='grid grid-cols-3 lg:grid-cols-6 gap-2 text-sm'>
        <p className='text-base font-bold hidden lg:block'>Proposal Id</p>
        <p className='text-base font-bold col-span-2 lg:col-span-3'>Title</p>
        <p className='text-base font-bold'>Status</p>
        <p className='text-base font-bold hidden lg:block'>Voting End Time</p>

        {proposals.filter(proposal => proposal.status === status).sort((a, b) => b.id - a.id).map((proposal, index) => (
          <Fragment key={index}>
            <p className="hidden lg:block">{proposal.id}</p>
            <div className="col-span-2 lg:col-span-3">
              <p>{proposal.title}</p>
              <div className="flex">
                <p className="text-xs rounded-full border-2 border-gray-500 p-1">{formatProposal(proposal.messages[0].content['@type'])}</p>
              </div>
            </div>
            <p>{formatStatus(proposal.status)}</p>
            <p className="hidden lg:block">{formatTime(proposal.voting_end_time)}</p>
          </Fragment>
        ))}
      </div>
    </>
  )
}

export default Proposals;