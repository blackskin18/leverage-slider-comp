import React, { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar } from 'recharts'
import './/style.scss'
import isEqual from 'react-fast-compare'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const renderBar = (
  currentBar: any,
  barData: any,
  barDataEntriesKeys: any,
  barColor: any,
  setBarData: any
) => {
  const barArray = []
  for (let i = 0; i < barDataEntriesKeys.length; i++) {
    barArray.push(
      <Bar
        className={currentBar.token === barData[barDataEntriesKeys[i]].token ? 'glowing-btn' : ''}
        style={{ transform: `translateY(-${5 * i}px)`, cursor: 'pointer' }}
        yAxisId={1000}
        dataKey={barDataEntriesKeys[i]}
        stackId='a'
        // stroke={
        //   currentBar.token === barData[barDataEntriesKeys[i]].token ? 'white' : ''
        // }
        // strokeWidth={2}
        isAnimationActive
        animationBegin={0}
        animationDuration={1000}
        animationEasing='ease-in-out'
        fill={barData[barDataEntriesKeys[i]].color}
        onClick={() => {
          setBarData(barData[barDataEntriesKeys[i]])
        }}
      />
    )
  }

  return barArray
}

const StackedBarChart = ({
  leverageData,
  currentBarData,
  height = 0,
  setBarData
}: {
  leverageData: any
  height?: number
  currentBarData: any
  setBarData: any
}) => {
  const bars = useMemo(() => {
    const barData = {}
    for (let i = 0; i < leverageData.bars.length; i++) {
      barData[i] = leverageData.bars[i]
    }
    return barData
  }, [leverageData.bars])

  const rightPixel = leverageData.xDisplay.length === 2 ? '-7px' : '-4px'

  // get color, bar size of each bar in current leverage
  const barDataEntriesKeys = Object.keys(bars || [])
  const barColorValues = []
  const barSize = []
  for (const i in bars) {
    barColorValues.push(bars[i].color)
    barSize.push(bars[i].size)
  }

  // calculate total height of bar in each leverage
  const barTotalSize = barSize.reduce((accumulator, value) => {
    return accumulator + value
  }, 0)

  // get height of each bar in current leverage
  const barSizeData = useMemo(() => {
    const result = {}
    for (const i in bars) {
      result[i] = bars[i].size
    }

    return result
  }, [bars])

  const selectNextBar = () => {
    const barsArr = Object.values(bars)
    const index = barsArr.findIndex((b: any) => {
      return b.token === currentBarData.token
    })
    setBarData(barsArr[index + 1] ? barsArr[index + 1] : barsArr[0])
  }

  return (
    <div style={{ position: 'relative', padding: '0' }}>
      <span
        onClick={selectNextBar}
        // style={{
        //   color: currentBarData.x === leverageData.x ? '#01A7FA' : '#666'
        // }}
        style={{
          color: '#666'
        }}
        className='label'
      >
        {leverageData.xDisplay}
      </span>
      {leverageData.xDisplay === '0x' ? (
        <div />
      ) : (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: `${
              barTotalSize === 100
                ? `-${100 + 30}px`
                : `-${
                  100 +
                  30 -
                  (100 - barTotalSize * (height > 100 ? height / 100 : 1))
                }px`
            }`,
            right: rightPixel
          }}
        >
          <BarChart
            className='d-flex'
            width={30}
            height={
              barTotalSize * (height > 100 ? height / 100 : 1) +
              (Object.values(barSizeData).length - 1)
            } // ?
            data={[barSizeData]}
          >
            {renderBar(
              currentBarData,
              bars,
              barDataEntriesKeys,
              barColorValues,
              setBarData
            )}
          </BarChart>
        </div>
      )}
    </div>
  )
}

const Component = ({
  setBarData,
  barData,
  leverageData,
  height
}: {
  height: number
  leverageData: any
  barData: any
  setBarData: any
}) => {
  const [x, setX] = useState(barData.x)
  // Return stacked bar chart of each leverage
  const getMark = () => {
    const finalData = {}
    leverageData.map((data: any) => {
      finalData[data.x] = (
        <StackedBarChart
          height={height}
          leverageData={data}
          currentBarData={barData}
          setBarData={setBarData}
        />
      )
    })

    return {
      ...finalData
    }
  }

  const selectDotMarkHandler = (value: any) => {
    let result = leverageData[0]
    let min = value
    leverageData.forEach((data: any) => {
      if (Math.abs(data.x - value) < min) {
        result = data
        min = Math.abs(data.x - value)
      }
    })
    if (result.bars[0].x !== barData.x) {
      setBarData(result.bars[0])
    }
    setX(result.x)
  }

  useEffect(() => {
    if (leverageData && leverageData.length > 0 && leverageData[0].bars.length > 0) {
      setBarData(leverageData[0].bars[0])
      setX(leverageData[0].bars[0].x)
    }
  }, [leverageData])

  // const leverage = useMemo(() => {
  //   return barData?.x || 0
  // }, [barData])

  // Default selected bar is LEVERAGE_DATA[0].bars[0]x
  // useEffect(() => {
  //   if (leverage === 0 && leverageData && leverageData[0]?.bars.length > 0) {
  //     setBarData(leverageData[0].bars[0])
  //     setX(leverageData[0].bars[0].x)
  //   }
  // }, [leverage])
  return (
    <div
      className='leverage-slider'
      style={{
        marginTop: height + 30,
        marginBottom: 35,
        paddingRight: 15,
        paddingLeft: 15
      }}
    >
      <Slider
        min={leverageData && leverageData[0] ? leverageData[0].x : 0}
        max={leverageData[leverageData.length - 1]?.x}
        step={1}
        value={x}
        onChange={(e) => {
          setX(e)
        }}
        onAfterChange={(value) => {
          selectDotMarkHandler(value)
        }}
        // included={false}
        // Fix clicking bar select the wrong pool check
        // onChange={(e: number) => {
        //   const data = leverageData.find((d: any) => {
        //     return d.x === e
        //   })
        //   // if (data?.bars[0]) {
        //   //   setBarData(data.bars[0])
        //   // }
        // }}
        count={1}
        // value={leverage}
        dotStyle={{
          background: '#303236',
          borderRadius: '2px',
          width: '1px',
          borderColor: '#303236',
          borderWidth: '2px',
          bottom: '-1px'
        }}
        trackStyle={{ backgroundColor: '#03c3ff', height: 2 }}
        handleStyle={{
          backgroundColor: 'white',
          borderColor: '#03c3ff',
          borderWidth: '2px'
        }}
        activeDotStyle={{
          borderColor: '#03c3ff'
        }}
        marks={getMark()}
        railStyle={{ backgroundColor: '#303236', height: '2px' }}
      />
    </div>
  )
}

export default React.memo(Component, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
)
