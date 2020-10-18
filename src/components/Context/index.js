import React from 'react'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore/index.js';

const Context = ({context, components})=>{
    const componentsStore = Component.create({ components });
    return <BaseComponent $context={ context } components={componentsStore.components} />
}

export default Context