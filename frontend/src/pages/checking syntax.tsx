useEffect(() => {
    // Listen for changes in localStorage
    function checkUserData() {
        const item = localStorage.getItem('userData');
        if (item) {
            const userData = JSON.parse(item);
            setUserData(userData);
            // Set user_level and name if available
            if (userData.user_level) {
                localStorage.setItem('user_level', userData.user_level);
            }
            if (userData.name) {
                localStorage.setItem('name', userData.name);
            }
        }
    }

    // Add event listener
    window.addEventListener('storage', checkUserData);

    // Fetch user data if access_token exists
    if (localStorage.getItem('access_token')) {
        fetch(BACKEND_URL + '/users/specific', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            },
        })
            .then((response) => response.json())
            .then((data) => setUserData(data));
    }

    // Clean up event listener
    return () => {
        window.removeEventListener('storage', checkUserData);
    };
}, []); // Empty dependency array means it runs only once

// Render user data or home page
if (userData) {
    return (
        <>
            <h2>You are logged in as:</h2>
            <p>{userData.username}</p>
            <p>{userData.employee_id}</p>
            <p>
                {userData.role} {userData.location}
            </p>
            <p>{userData.user_level}</p>
        </>
    );
} else {
    return <h2>Home Page - nothing for now</h2>;
}