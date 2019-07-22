export const user = {
    /**
    * Gets the programmatic name of the entire locale, with the language,
    *   country and variant separated by underbars. The Language is always lower case,
    *   and country is always upper case. If the language is missing,
    *   the string will begin with an underscore character.
    *   If both the language and country fields are missing,
    *   this function will return the empty string,
    *   even if the variant field is filled in (you cannot have a locale with just a variant--
    *   the variant must accompany a valid language or country code). Examples: "en"
    *
    */
    en: {
        user_id:'User ID',
        user_name:'Username',
        add_user:'Add user',
        user_information:'user Information',
        first_name:'First Name',
        last_name:'Last Name',
        full_name: 'Full Name',
        email_id:'Email ID',
        password: 'Password',
        phone:'Phone',
        edit_user:'Edit user',
        edit_profile:'Edit Profile',
        user_management:'User Management',
        role:'Role',
        select_role:'Select Role',
        action:'Action',
        mobile: 'Mobile',
        user_status:'User Status',
        mobile_number:'Mobile Number',
        phone_number:'Phone Number',
        status:'Status',
        new_password:'New Password',
        confirm_password:'Confirm Password',
        current_password:"Current Password",
        change_password:"Change Password",
        location: "Location",
        exam_prefered_location: "Exam Prefered Location",
        admin_users: "Admin Users",
        profile_image:"Profile Image",
        joined_on:'Joined On',
        password_change:{
            success:'Password updated successfully',
			error:'Unable to update password. Please try again'
        },
        profile:{
            get:{
                error: 'Unable to find the data. Please try again'
            },
            update:{
                success:'Profile updated successfully.',
                error:'Unalbe to update the profile. Please try again.'
            }
        },
        add:{
            success: 'User added successfully',
            error: 'Unable to add the User. Please try again.'
        },
        edit:{
            success: 'User updated successfully',
            error: 'Unable to update the user. Please try again.'
        },
    }
}
