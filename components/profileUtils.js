import { supabase } from "./auth/supabase";

export const createTimestamp = async (user_id, timestamp, index) => {
  try {
    // Create a timestamp in ISO format

    const { error: insertError } = await supabase.from("user_images").insert([
      {
        user_id: user_id,
        last_modified: timestamp,
      },
    ]);

    if (insertError) {
      console.error(insertError);
      return false;
    }

    return timestamp;
  } catch (error) {
    console.error(error);
    return false;
  }
};
