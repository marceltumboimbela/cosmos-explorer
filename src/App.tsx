import { useState, useEffect, useRef } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Blocks } from './Components/Blocks';
import { Transactions } from './Components/Transactions';
import { Proposals } from './Components/Proposals';
import { Validators } from './Components/Validators';
import { CurrentBlock } from './Components/CurrentBlock'
import { Sidebar } from './Components/Sidebar'
import { MobileSidebar } from './Components/MobileSidebar'
import type { Block, Validator, Proposal } from './types'

function App() {
  const [block, setBlock] = useState<Block | null>(null)
  const [blocks, setBlocks] = useState<Array<Block>>([])
  const [validators, setValidators] = useState<Array<Validator>>([])
  const [proposals, setProposals] = useState<Array<Proposal>>([])
  const [displayMobileSidebar, setDisplayMobileSidebar] = useState<boolean>(false)
  const timeout = useRef<number | null>(null)

  function getBlocks() {
    fetch('https://cosmos-rest.publicnode.com/cosmos/base/tendermint/v1beta1/blocks/latest')
      .then(response => response.json())
      .then(response => {
        setBlock(response.block)
        if(blocks.length >= 50){
          blocks.shift()
        }
        setBlocks([...blocks, response.block])
      })
      .catch(err => console.error(err));
  }

  function getValidators() {
    fetch('https://cosmos-rest.publicnode.com/cosmos/staking/v1beta1/validators?pagination.limit=500')
      .then(response => response.json())
      .then(response => setValidators(response.validators))
      .catch(err => console.error(err));
  }

  function getProposals() {
    fetch('https://cosmos-rest.publicnode.com/cosmos/gov/v1/proposals?pagination.limit=500')
      .then(response => response.json())
      .then(response => setProposals(response.proposals))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    timeout.current = setTimeout(() => {
      getBlocks()
    }, 6000)

    return(() => {
      clearTimeout(timeout.current!)
    })
  }, [block])
  
  useEffect(() => {
    getBlocks()
    getValidators()
    getProposals()
  }, [])

  return (
    <Router>
      <div className='flex'>
        <Sidebar/>
        {displayMobileSidebar && <MobileSidebar handleCloseClick={() => setDisplayMobileSidebar(false)} />}
        <div className='p-4 grow'>
          {block && <CurrentBlock block={block} handleMenuBarClick={() => setDisplayMobileSidebar(true)} />}
          <Routes>
            <Route path="/" element={<Blocks blocks={blocks} validators={validators} />} />
            <Route path="/transactions" element={<Transactions blocks={blocks} />} />
            <Route path="/proposals" element={<Proposals proposals={proposals} />} />
            <Route path="/validators" element={<Validators validators={validators} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
