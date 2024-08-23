import React, { ChangeEvent } from "react"
import classes from "./checkbox.module.css"

interface CheckBoxProps {
  name: string
  checked: boolean
  // eslint-disable-next-line no-unused-vars
  onChecked: (event: ChangeEvent<HTMLInputElement>) => void
}

const CheckBox: React.FC<CheckBoxProps> = ({ name, checked, onChecked }) => {
  return (
    <>
      <input
        type="checkbox"
        className={`${classes.input} cursor-pointer opacity-0 absolute h-8 w-8`}
        name={name}
        checked={checked}
        onChange={onChecked}
      />
      <div className="bg-white border-2 rounded-md w-8 h-8 flex flex-shrink-0 justify-center items-center mr-2">
        <svg
          className="hidden"
          width="32"
          height="32"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="u:check">
            <path
              id="Vector"
              d="M15.7989 5.76686C15.7245 5.69189 15.6361 5.63239 15.5386 5.59178C15.4411 5.55118 15.3366 5.53027 15.231 5.53027C15.1254 5.53027 15.0209 5.55118 14.9234 5.59178C14.826 5.63239 14.7375 5.69189 14.6631 5.76686L8.70454 11.7335L6.20113 9.22204C6.12393 9.14747 6.0328 9.08883 5.93294 9.04948C5.83308 9.01013 5.72644 8.99083 5.61912 8.99268C5.51181 8.99454 5.4059 9.01752 5.30746 9.0603C5.20902 9.10309 5.11998 9.16484 5.0454 9.24204C4.97083 9.31924 4.91219 9.41037 4.87284 9.51023C4.83348 9.61009 4.81418 9.71673 4.81604 9.82405C4.8179 9.93136 4.84087 10.0373 4.88366 10.1357C4.92644 10.2341 4.9882 10.3232 5.0654 10.3978L8.13668 13.469C8.21103 13.544 8.29949 13.6035 8.39695 13.6441C8.49442 13.6847 8.59896 13.7056 8.70454 13.7056C8.81013 13.7056 8.91467 13.6847 9.01213 13.6441C9.1096 13.6035 9.19806 13.544 9.27241 13.469L15.7989 6.94258C15.8801 6.86768 15.9448 6.77678 15.9892 6.67561C16.0335 6.57443 16.0564 6.46517 16.0564 6.35472C16.0564 6.24426 16.0335 6.135 15.9892 6.03383C15.9448 5.93265 15.8801 5.84175 15.7989 5.76686Z"
              fill="white"
            />
          </g>
        </svg>
      </div>{" "}
    </>
  )
}
export default CheckBox
