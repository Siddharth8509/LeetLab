import validator from "validator"

function authValidate(data)
{
    //check for mandatory fields
    const mandatory = ["firstname","age","password","gender","emailId"];
    for (const field of mandatory) 
    {
        if (data[field] === undefined || data[field] === null || data[field] === "")
            throw new Error("Please enter all mandatory fields");
    }
    
    //validate firstname
    const firstname = data.firstname.trim();
    if(2>firstname.length || firstname.length>10)
        throw new Error("Invalid Name")

    //validate lastname
    if (data.lastname) {
        const lastname = data.lastname.trim();
        if (lastname.length < 2 || lastname.length > 10)
            throw new Error("Invalid lastname");
    }

    //validate age
    const age = data.age;
    if(6>age || age>60)
        throw new Error("You are not eligible to use this application")

    //validate gender
    const gender = data.gender.toLowerCase().trim();
    const validGender = ["male","female","others"];
    if(!validGender.includes(gender))
        throw new Error("Invalid gender");

    //validate password
    const password = data.password;
    if(!validator.isStrongPassword(password))
        throw new Error("Please enter a strong password");

    //validate email
    const emailId = data.emailId;
    if(!validator.isEmail(emailId))
        throw new Error("Please enter a valid email id");

    return true;
}

export default authValidate;