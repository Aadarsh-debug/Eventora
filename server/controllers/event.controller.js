import Event from "../models/Event.js"

export const getAllEvent=async(req,res)=>{
  try{
  const filter={};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
  const events=await Event.find(filter);
  res.json({events})
  }catch(error){
    res.status(500).json({ message: 'Server Error', error: error.message})
  }
};
export const getEventById=async(req,res)=>{
  try {
    const event=await Event.findById(req.params.id);
    if(!event) return res.status(404).json({message:"event not found"})
    res.json({event});
  } catch (error) {
     res.status(500).json({ message: 'Server Error', error: error.message})
  }
}
export const createEvent=async(req,res)=>{
  try {
    
  const {title, description, date, location, category, totalSeats, ticketPrice, image}=req.body;
  const event=await Event.create({
    title,
    description,
    date,
    location,
    category,
    totalSeats,
    availableSeats: totalSeats,
    ticketPrice:ticketPrice||0,
    image:image||''
  });
  res.status(201).json({event})
} catch (error) {
    res.status(500).json({message:"server Error",error:error.message});
}
}

export const updateEvent=async(req,res)=>{
  try {
    
  const {title, description, date, location, category, totalSeats, ticketPrice, image}=req.body;
  const event =await Event.findByIdAndUpdate(req.params.id,{
    title, 
    description, 
    date, 
    location, 
    category, 
    totalSeats, 
    ticketPrice, 
    image
  },{new:true});
  if(!event)return res.status(404).json({message:"event not found "})
  res.json({event})
} catch (error) {
     res.status(500).json({message:"server Error",error:error.message});
  }
}

export const deleteEvent=async(req,res)=>{
  try {   
  const event =await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({message:"server Error",error:error.message});
  }
}