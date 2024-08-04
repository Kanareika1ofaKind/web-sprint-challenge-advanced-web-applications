import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
    const [spinnerOn, setSpinnerOn] = useState(false)
    

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
    const redirectToLogin = () => { /* ✨ implement */
        navigate('/')
    }
    const redirectToArticles = () => { /* ✨ implement */
        navigate('/articles')
    }

  const logout = () => {
    // ✨ implement
      // If a token is in local storage it should be removed,
      localStorage.removeItem('token')
      // and a message saying "Goodbye!" should be set in its proper state.
      setMessage('GoodBye!')
      // In any case, we should redirect the browser back to the login screen,
      redirectToLogin()
    // using the helper above.
  }

  const login = async ({ username, password }) => {
    // ✨ implement
      // We should flush the message state, turn on the spinner
      setMessage('')
      setSpinnerOn(true)
      // and launch a request to the proper endpoint.

      try {
          const { data } = await axios.post(
              loginUrl,
              { username, password }
          )
          // On success, we should set the token to local storage in a 'token' key,
          localStorage.setItem('token', data.token)
          // put the server success message in its proper state, and redirect
          redirectToArticles()
              // to the Articles screen. Don't forget to turn off the spinner!
           setSpinnerOn(false)
           setMessage(data.message) // "Welcome back" message
      }
      catch (err) {
          setSpinnerOn(false)
          setMessage(err.response.data.message)
      }
  }

  const getArticles = () => {
    // ✨ implement
      // We should flush the message state, turn on the spinner
      setMessage('')
      setSpinnerOn(true)
      // and launch an authenticated request to the proper endpoint.
      const token = localStorage.getItem('token') 

      const fetchArticles = async () => {

          try {
              const { data } = await axios.get(
                  articlesUrl,
                  { headers: { authorization: token } },
              )


              // On success, we should set the articles in their proper state and
              setArticles(data.articles)
              // put the server success message in its proper state.
              setMessage(data.message)
              
              setSpinnerOn(false)
          }
          catch (err) {
              // If something goes wrong, check the status of the response:
              setMessage(err.response.data.message)

              if (err.response.status === 401) {
                  redirectToLogin()
              }
              setSpinnerOn(false)

          }         

      }
      fetchArticles()
    
  }

    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!

  const postArticle = article => {
      // ✨ implement

      // We should flush the message state, turn on the spinner
      setMessage('')
      setSpinnerOn(true)

      const token = localStorage.getItem('token')
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
      // to inspect the response from the server.

      const postArt = async () => {
          try {
              const { data } = await axios.post(
                  articlesUrl, article,
                  {
                      headers: { authorization: token },

                  },
              )
              setArticles([...articles, data.article])
              setMessage(data.message)
              setSpinnerOn(false)
          } catch (err) {
              setMessage(err.response.message)
              if (err.response.status === 401) {
                  redirectToLogin()
              }
              setSpinnerOn(false)
              
          }
      }
      postArt()


              // On success, we should set the articles in their proper state and
              // put the server success message in its proper state.

              // If something goes wrong, check the status of the response:
  }

  const updateArticle = ({ article_id, article }) => {
      // ✨ implement

      setMessage('')
      setSpinnerOn(true)

      const token = localStorage.getItem('token')

      const putArt = async () => {
          try {
              const { data } = await axios.put(
                  `${articlesUrl}/${article_id}`,
                  article,
                  {
                      headers: { authorization: token },

                  },
              )


              setArticles(prevArts => prevArts.map(art => {
                  if (art.article_id == article_id) {
                      return { ...art, ...article }
                  }
                  return art
              }))

              setMessage(data.message)
              setSpinnerOn(false)
          } catch (err) {
              setMessage(err.response.message)
              if (err.response.status === 401) {
                  redirectToLogin()
              }
              setSpinnerOn(false)

          }
      }
      putArt()


    // You got this!
  }

  const deleteArticle = article_id => {
      // ✨ implement

      setMessage('')
      setSpinnerOn(true)

      const token = localStorage.getItem('token')

      const delArt = async () => {
          try {
              const { data } = await axios.delete(
                  `${articlesUrl}/${article_id}`,
                  {
                      headers: { authorization: token },

                  },
              )            


              const filtered = articles.filter(function (art) { return art.article_id != article_id; })
              setArticles(filtered)

              setMessage(data.message)
              setSpinnerOn(false)
          } catch (err) {
              setMessage(err.response.message)
              if (err.response.status === 401) {
                  redirectToLogin()
              }
              setSpinnerOn(false)

          }
      }
      delArt()
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
          <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
          <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
              
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
                  <Route path="/" element={<LoginForm login={login} />} /> 
          <Route path="articles" element={
                      <>
              
                          <ArticleForm
                              postArticle={postArticle}
                              articles={articles}
                              currentArticleId={currentArticleId}
                              setCurrentArticleId={setCurrentArticleId}
                              updateArticle={updateArticle}                          />
                          <Articles
                              articles={articles}
                              getArticles={getArticles}
                              setCurrentArticleId={setCurrentArticleId}
                              deleteArticle={deleteArticle} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
