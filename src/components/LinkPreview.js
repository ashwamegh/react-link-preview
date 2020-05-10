import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './LinkPreview.css'

const isValidUrlProp = (props, propName, componentName) => {
  if (!props) {
    return new Error(`Required parameter URL was not passed.`)
  }
  if (!isValidUrl(props[propName])) {
    return new Error(
      `Invalid prop '${propName}' passed to '${componentName}'. Expected a valid url.`
    )
  }
}

const isValidUrl = (url) => {
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
  const validUrl = regex.test(url)
  return validUrl
}

function LinkPreview(props) {
  const [loading, setLoading] = useState(true)
  const [preview, setPreviewData] = useState({})
  const [isUrlValid, setUrlValidation] = useState(false)

  const {
    url,
    width,
    maxWidth,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    onClick,
    render
  } = props

  const api = 'https://lpdg.herokuapp.com/parse/link'

  const style = {
    width,
    maxWidth,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft
  }

  useEffect(() => {
    async function fetchData() {
      const fetch = window.fetch
      if (isValidUrl(url)) {
        setUrlValidation(true)
      } else {
        return {}
      }
      setLoading(true)
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })
      const data = await response.json()
      setPreviewData(data)
      setLoading(false)
    }
    fetchData()
  }, [url])

  if (!isUrlValid) {
    console.error(
      'LinkPreview Error: You need to provide url in props to render the component'
    )
    return null
  }

  // If the user wants to use its own element structure with the fetched data
  if (render) {
    return render({
      loading: loading,
      preview: preview
    })
  } else if (loading) {
    return (
      <div>
        <div className={styles['link-preview-section']} style={style}>
          <div className={styles['link-description']}>
            <div className={styles.domain}>
              <span
                className={
                  (styles['link-url-loader'], styles['animated-background'])
                }
              >
                facebook.com
              </span>
            </div>
            <div className={styles['link-data-loader']}>
              <div className={(styles.p1, styles['animated-background'])}>
                Shashank Shekhar
              </div>
              <div className={(styles.p2, styles['animated-background'])}>
                This is some description
              </div>
            </div>
          </div>
          <div className={styles['link-image-loader']}>
            <div className={styles.img} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div
          className={styles['link-preview-section']}
          style={style}
          onClick={onClick}
        >
          <div className={styles['link-description']}>
            <div className={styles.domain}>
              <span className={styles['link-url']}>{preview.domain}</span>
            </div>
            <div className={styles['link-data']}>
              <div className={styles['link-title']}>{preview.title}</div>
              <div className={styles['link-description']}>
                {preview.description}
              </div>
            </div>
          </div>
          <div className={styles['link-image']}>
            {preview.img && <img src={preview.img} alt={preview.description} />}
          </div>
        </div>
      </div>
    )
  }
}

LinkPreview.defaultProps = {
  onClick: () => {},
  width: '90%',
  maxWidth: '700px',
  marginTop: '18px',
  marginBottom: '18px',
  marginRight: 'auto',
  marginLeft: 'auto'
}

LinkPreview.propTyps = {
  url: isValidUrlProp,
  onClick: PropTypes.func,
  render: PropTypes.func,
  width: PropTypes.string,
  maxWidth: PropTypes.string,
  marginTop: PropTypes.string,
  marginBottom: PropTypes.string,
  marginRight: PropTypes.string,
  marginLeft: PropTypes.string
}

export default LinkPreview
