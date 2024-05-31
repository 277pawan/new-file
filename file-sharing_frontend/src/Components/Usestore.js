import create from 'zustand'
const Usestore = create((set) => ({
    userid: '',
    username: '',
    useremail: '',
    userimage: '',
    setzuserid: (userid) => set({ userid }),
    setzusername: (username) => set({ username }),
    setzuseremail: (useremail) => set({ useremail }),
    setzuserimage: (userimage) => set({ userimage }),

}))
export default Usestore;