import React, { Suspense, useMemo, useState } from 'react'
import './style.scss'
import '../../styles/main.scss'
import 'web3-react-modal/dist/index.css'
import { BlurBackground } from '../BlurBackground'
import { BigNumber } from 'ethers'

const bn = BigNumber.from

const LEVERAGE_DATA = [
  {
    x: 4,
    xDisplay: '4x',
    totalSize: bn('0x4dec282667716233'),
    bars: [
      {
        x: 4,
        token: '0x767311aeb1818218E25655aeEE096982bb690013-16',
        size: 1.5,
        color: '#01A7FA',
        reserve: bn('0x360d7792eba77258'),
        opacity: 0.050000000000000044
      },
      {
        x: 4,
        token: '0x767311ceb1818218E25655aeEE096982bb690013-16',
        size: 4.5,
        color: '#01A7FA',
        reserve: bn('0x360d7792eba77258'),
        opacity: 0.050000000000000044
      }
    ]
  },
  {
    x: 9,
    xDisplay: '9x',
    totalSize: bn('0x1813e2fe4ba5869a'),
    bars: [
      {
        x: 9,
        token: '0x086D9928f862C95359C6624B74e4fEf3a9e79a74-16',
        size: 30.89,
        color: '#01A7FA',
        reserve: bn('0x1813e2fe4ba5869a'),
        opacity: 0.3
      },
      {
        x: 9,
        token: '0x7c4a2262C23fCc45e102BD8D0fA3541Ec544e59s-16',
        size: 30.63,
        color: '#FF98E5',
        reserve: bn('0x17deb0937bc9efdb')
      }
    ]
  },
  {
    x: 21,
    xDisplay: '21x',
    totalSize: bn('0x17d868afc6b2f74b'),
    bars: [
      {
        x: 21,
        token: '0x43200e62dC33C82C0e69D355480a7140eE527088-16',
        size: 30.6,
        color: '#01A7FA',
        reserve: bn('0x17d868afc6b2f74b'),
        isDashed: true
      }
    ]
  },
  {
    x: 35,
    xDisplay: '35x',
    totalSize: bn('0x17a38db0b0646c82'),
    bars: [
      {
        x: 35,
        token: '0x37De2624B664e3da084F9c2177b6FCf0Fd2406de-16',
        size: 30.33,
        color: '#01A7FA',
        reserve: bn('0x17a38db0b0646c82')
      }
    ]
  }
]

export const AppLayout = (props: any) => {
  const { Component: LeverageSlider } = props
  const [barData, setBarData] = useState<any>(LEVERAGE_DATA[0].bars[0])
  const [height, setHeight] = useState(100)

  const leverage = useMemo(() => {
    return barData.x || 0
  }, [barData])

  return (
    <div className={`body dark'}`}>
      <button onClick={() => {
        setBarData({})
      }}>
        test
      </button>
      <BlurBackground pointNumber={20}>
        <section
          className='layout'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100px',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <button onClick={() => setHeight(200)}>+</button>
            <button onClick={() => setHeight(100)}>-</button>
          </div>
          <Suspense fallback={null}>
            <div className='card'>
              <LeverageSlider
                leverage={leverage}
                setBarData={setBarData}
                barData={barData}
                leverageData={LEVERAGE_DATA}
                height={height}
              />

              <pre>{JSON.stringify(barData, undefined, 2)}</pre>
            </div>
          </Suspense>
        </section>
      </BlurBackground>
    </div>
  )
}
