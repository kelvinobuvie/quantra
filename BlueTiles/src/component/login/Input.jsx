import React from 'react'

const Input = ({ type, label, placeholder, value, onChange, icon }) => {
  return (
    <div className="input-container w-[400px] h-[100px] bg-white shadow-md py-[21px] px-[34px]">
      <label className="input-label text-base">{label}</label>
      <div className="input-wrapper">
        <input 
          type={type}
          className="input-field w-full text-blue-950"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <span className="input-icon">{icon}</span>
      </div>
    </div>
  )
}

export default Input