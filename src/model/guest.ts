type GuestModel = {
  id: string;
  roomId: string;
  key: string;
  photo: string | null;
  name: string;
  gender: "male" | "female";
  address: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

export default GuestModel;
