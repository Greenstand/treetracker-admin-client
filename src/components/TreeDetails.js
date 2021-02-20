import React from 'react'

const TreeDetails = props => {
  let { tree } = props
  const treeImage = (tree.imageUrl !== null) ? <img className="tree-image" src={tree.imageUrl} alt={`tree ${tree.id}`}/> : null
  const isAlive = (tree.causeOfDeathId !== null) ? 'Dead' : 'Alive'
  const treeMissing = (tree.missing) ? 'True' : 'False'
  return (
    <div className="tree-panel">
      {treeImage}
      <p className="tree-location">Location: {tree.lat} {tree.lon}</p>
      <p className="tree-dead">Status: {isAlive}</p>
      <p className="tree-missing">Missing: {treeMissing}</p>
    </div>
  )
}

export default TreeDetails
