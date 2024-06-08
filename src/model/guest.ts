type GuestModel = {
    id: string,
    key: string,
    name: string,
    gender: "male"|"female",
    address: string,
    email: string,
    phone: string,
    createdAt: Date,
    updatedAt: Date
}

export default GuestModel
