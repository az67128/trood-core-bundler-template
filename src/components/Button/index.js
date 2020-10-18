import React from 'react'
import styles from './style.module.css'

const Button = ({children, onClick})=>{
  return <button className={styles.root} onClick={onClick}>{children}</button>
}

export default Button