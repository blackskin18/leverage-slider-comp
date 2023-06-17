import React, { useEffect, useMemo } from 'react'
import { BarChart, Bar } from 'recharts'
import './/style.scss'
import isEqual from 'react-fast-compare'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const renderBar = (currentBar: any, barData: any, barDataEntriesKeys: any, barColor: any, setLeverage: any) => {
  const barArray = []
  for (let i = 0; i < barDataEntriesKeys.length; i++) {
    barArray.push(
      <Bar
        style={{ transform: `translateY(-${5 * i}px)` }}
        yAxisId={1000}
        dataKey={barDataEntriesKeys[i]}
        stackId='a'
        stroke={currentBar.token === barData[barDataEntriesKeys[i]].token ? 'red' : ''}
        fill={barData[barDataEntriesKeys[i]].color}
        onClick={() => {
          setLeverage(barData[barDataEntriesKeys[i]])
        }}
      />
    )
  }

  return barArray
}
const StackedBarChart = ({
  leverageData,
  bars,
  barColor,
  currentBarData,
  height = 0,
  setBarData
}: {
  leverageData: any
  height?: number
  currentBarData: any
  bars: any
  barColor?: {}
  setBarData: any
}) => {
  console.log({
    bars,
    barColor,
    currentBarData,
    height,
    setBarData
  })
  const rightPixel = leverageData.xDisplay.length === 2 ? '-7px' : '-4px'
  const barDataEntriesKeys = Object.keys(bars || [])
  const barColorValues = []
  const barSize = []
  const code = 'a'.charCodeAt(0)
  for (let i = 0; i < Object.keys(barColor || {}).length; i++) {
    barColorValues.push(barColor?.[String.fromCharCode(code + i)])
    barSize.push(bars?.[String.fromCharCode(code + i)]?.size)
  }
  const barTotalSize = barSize.reduce((accumulator, value) => {
    return accumulator + value
  }, 0)

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
        style={{ color: currentBarData.x === leverageData.x ? '#01A7FA' : '#666' }}
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
                ? `-${height + 30}px`
                : `-${height + 30 - (100 - barTotalSize)}px`
            }`,
            right: rightPixel
          }}
        >
          <BarChart
            className='d-flex'
            width={30}
            height={barTotalSize + (Object.values(barSizeData).length - 1) * 5}
            data={[barSizeData]}
          >
            {renderBar(currentBarData, bars, barDataEntriesKeys, barColorValues, setBarData)}
          </BarChart>
        </div>
      )}
    </div>
  )
}

const Component = (
  {
    setBarData,
    barData,
    leverageData,
    height
  }: {
    height: number,
    leverageData: any,
    barData: any,
    setBarData: any
  }
) => {
  const initToChar = (num: any) => {
    const code = 'a'.charCodeAt(0)
    return String.fromCharCode(code + num)
  }

  const getBarColor = (data: any) => {
    const barColor = {}
    for (let i = 0; i < data.length; i++) {
      barColor[initToChar(i)] = data[i].color
    }
    return barColor
  }

  const getBarData = (data: any) => {
    const barData = {}
    for (let i = 0; i < data.length; i++) {
      barData[initToChar(i)] = data[i]
    }
    return barData
  }

  const getMark = () => {
    const finalData = {}
    leverageData.map((data: any) => {
      finalData[data.x] = (
        <StackedBarChart
          height={height}
          leverageData={data}
          currentBarData={barData}
          bars={getBarData(data.bars)}
          barColor={getBarColor(data.bars)}
          setBarData={setBarData}
        />
      )
    })

    return {
      ...finalData
    }
  }

  const leverage = useMemo(() => {
    return barData?.x || 0
  }, [barData])

  useEffect(() => {
    if (leverage === 0 && leverageData && leverageData[0]?.bars.length > 0) {
      setBarData(leverageData[0].bars[0])
    }
  }, [leverage])

  return (
    <div style={{ marginTop: height + 30, marginBottom: 35, paddingRight: 15, paddingLeft: 15 }}>
      <Slider
        min={leverageData[0].x}
        max={leverageData[leverageData.length - 1].x}
        step={null}
        count={1}
        value={leverage}
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
