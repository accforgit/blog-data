import { useRef, useEffect } from 'react'
import Resize, { EMoveEffect, EDirection } from '@/util/resize'
import './test.less'

export default function Test() {
  const box1Ref1 = useRef<HTMLDivElement>(null)
  const box1Ref2 = useRef<HTMLDivElement>(null)
  const box1Ref3 = useRef<HTMLDivElement>(null)
  const box1Ref4 = useRef<HTMLDivElement>(null)
  const moveBox1AfterRef = useRef<HTMLDivElement>(null)
  const moveBox2BeforeRef = useRef<HTMLDivElement>(null)
  const moveBox2AfterRef = useRef<HTMLDivElement>(null)
  const moveBox3BeforeRef = useRef<HTMLDivElement>(null)
  const moveBox3AfterRef = useRef<HTMLDivElement>(null)
  const moveBox4BeforeRef = useRef<HTMLDivElement>(null)
  const child1Ref1 = useRef<HTMLDivElement>(null)
  const child1Ref2 = useRef<HTMLDivElement>(null)
  const child1Ref3 = useRef<HTMLDivElement>(null)
  const child1Ref4 = useRef<HTMLDivElement>(null)
  const moveChild1AfterRef = useRef<HTMLDivElement>(null)
  const moveChild2BeforeRef = useRef<HTMLDivElement>(null)
  const moveChild2AfterRef = useRef<HTMLDivElement>(null)
  const moveChild3BeforeRef = useRef<HTMLDivElement>(null)
  const moveChild3AfterRef = useRef<HTMLDivElement>(null)
  const moveChild4BeforeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeV = new Resize({
      direction: EDirection.V,
      list: [
        { moveData: [
          { ele: moveChild1AfterRef.current!, effect: EMoveEffect.Expand },
        ], containerEle: child1Ref1.current!, minHeight: 16 },
        { moveData: [
          { ele: moveChild2BeforeRef.current!, effect: EMoveEffect.Shrink },
          { ele: moveChild2AfterRef.current!, effect: EMoveEffect.Expand }
        ], containerEle: child1Ref2.current!, minHeight: 32 },
        { moveData: [
          { ele: moveChild3BeforeRef.current!, effect: EMoveEffect.Shrink },
          { ele: moveChild3AfterRef.current!, effect: EMoveEffect.Expand }
        ], containerEle: child1Ref3.current!, minHeight: 32 },
        {
          moveData: [{ ele: moveChild4BeforeRef.current!, effect: EMoveEffect.Shrink }],
          containerEle: child1Ref4.current!,
          minHeight: 16
        },
      ]
    })
    const resizeH = new Resize({
      direction: EDirection.H,
      list: [
        {
          moveData: [{ ele: moveBox1AfterRef.current!, effect: EMoveEffect.Expand }],
          containerEle: box1Ref1.current!,
          minWidth: 16
        },
        {
          moveData: [
            { ele: moveBox2BeforeRef.current!, effect: EMoveEffect.Shrink },
            { ele: moveBox2AfterRef.current!, effect: EMoveEffect.Expand },
          ],
          containerEle: box1Ref2.current!,
          minWidth: 32
        },
        {
          moveData: [
            { ele: moveBox3BeforeRef.current!, effect: EMoveEffect.Shrink },
            { ele: moveBox3AfterRef.current!, effect: EMoveEffect.Expand },
          ],
          containerEle: box1Ref3.current!,
          minWidth: 32
        },
        {
          moveData: [{ ele: moveBox4BeforeRef.current!, effect: EMoveEffect.Shrink }],
          containerEle: box1Ref4.current!,
          minWidth: 16
        }
      ]
    })
    return () => {
      resizeV.destory()
      resizeH.destory()
    }
  }, [])

  return (
    <div className="test">
      <div className="box box1" ref={box1Ref1}>
        <div className="after" ref={moveBox1AfterRef}>1</div>
        <div className="child child1" ref={child1Ref1}>
          <div className="after" ref={moveChild1AfterRef}>1</div>
        </div>
        <div className="child child2" ref={child1Ref2}>
          <div className="before" ref={moveChild2BeforeRef}>2</div>
          <div className="after" ref={moveChild2AfterRef}>2</div>
        </div>
        <div className="child child3" ref={child1Ref3}>
          <div className="before" ref={moveChild3BeforeRef}>3</div>
          <div className="after" ref={moveChild3AfterRef}>3</div>
        </div>
        <div className="child child4" ref={child1Ref4}>
          <div className="before" ref={moveChild4BeforeRef}>4</div>
        </div>
      </div>
      <div className="box box2" ref={box1Ref2}>
        <div className="before" ref={moveBox2BeforeRef}>2</div>
        <div className="after" ref={moveBox2AfterRef}>2</div>
      </div>
      <div className="box box3" ref={box1Ref3}>
        <div className="before" ref={moveBox3BeforeRef}>3</div>
        <div className="after" ref={moveBox3AfterRef}>3</div>
      </div>
      <div className="box box4" ref={box1Ref4}>
        <div className="before" ref={moveBox4BeforeRef}>4</div>
      </div>
    </div>
  )
}

