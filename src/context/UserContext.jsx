import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
export const userDataContext = createContext()

function UserContext({ children }) {
    // const serverUrl = "http://localhost:8000"
    const serverUrl = import.meta.env.VITE_API_URL
    const [userData, setUserData] = useState(null)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
            setUserData(result.data)
        } catch (error) {
            console.log("Get current user error:", error)
        }
    }

    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(
                `${serverUrl}/api/user/asktoassistant`,
                { command },
                { withCredentials: true }
            )
            console.log("Backend response:", result.data)
            return result.data
        } catch (error) {
            console.error("getGeminiResponse error:", error?.response?.data || error.message)
            // Return a fallback so the UI doesn't crash
            return {
                type: "general",
                userInput: command,
                response: "Sorry, I couldn't process that. Please try again."
            }
        }
    }

    useEffect(() => {
        handleCurrentUser()
    }, [])

    const value = {
        serverUrl, userData, setUserData,
        backendImage, setBackendImage,
        frontendImage, setFrontendImage,
        selectedImage, setSelectedImage,
        getGeminiResponse
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext
