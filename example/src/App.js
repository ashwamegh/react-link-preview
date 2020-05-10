import React from 'react'

import LinkPreview from '@ashwamegh/react-link-preview'
import '@ashwamegh/react-link-preview/dist/index.css'

function CustomComponent ({ loading, preview }) {
	return loading 
	? (<h1>Loading...</h1>)
	: (
		<div>
			<p>Domain: { preview.domain }</p>
			<p>Title: { preview.title }</p>
			<p>Description: { preview.description }</p>
			<img height="100px" width="100px" src={preview.img} alt={preview.title} />
		</div>
	)
}

function App () {
  return <LinkPreview url="https://reactjs.org"/>
}

export default App
