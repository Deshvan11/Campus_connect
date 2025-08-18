const getNextCustomId = async (model, prefix) => {
    try {
      // Find the latest document in the collection (sorted by ID)
      const lastDoc = await model.findOne().sort({ id: -1 });
  
      let nextNumber = 1; // Default for first record
  
      if (lastDoc) {
        // Extract the numeric part and increment it
        const lastId = lastDoc.id; // Example: "P0001"
        const lastNumber = parseInt(lastId.replace(prefix, ""), 10);
        nextNumber = lastNumber + 1;
      }
  
      // Format the new ID with leading zeros (e.g., P0002, P0010)
      return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
    } catch (error) {
      console.error("Error generating custom ID:", error);
      throw new Error("ID generation failed");
    }
  };
  