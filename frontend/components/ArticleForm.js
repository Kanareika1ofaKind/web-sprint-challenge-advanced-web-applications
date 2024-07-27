import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
    // ✨ where are my props? Destructure them here
    const { postArticle, currentArticleId, setCurrentArticleId, updateArticle, articles } = props

  useEffect(() => {


      if (currentArticleId === null) {
          setValues(initialFormValues)
      } else {
          const { title, text, topic } = articles.find(art => art.article_id === currentArticleId)
          setValues({ title, text, topic })
      }

  }, [currentArticleId])





  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
      // We must submit a new post or update an existing one,
      // depending on the truthyness of the `currentArticle` prop.

      if (currentArticleId === null) {
          postArticle({ ...values })
      }
      else if (currentArticleId !== null) { updateArticle({ article_id: currentArticleId, article: { ...values } }) }

      setCurrentArticleId(null)
      setValues(initialFormValues)

  }

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values

    const {title, text, topic} = values

      if (title.trim().length >= 1 && text.trim().length >= 1 && ['javascript', 'react', 'node'].includes(topic.toLowerCase()) ) {
        return false
    }
    return true
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
          <h2>{currentArticleId ? 'Edit' : 'Create'}  Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
              <button type="submit" disabled={isDisabled()} id="submitArticle">Submit</button>
              <button type="button" onClick={() => setCurrentArticleId(null)}>Cancel {currentArticleId ? 'Edit' : ''}</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
