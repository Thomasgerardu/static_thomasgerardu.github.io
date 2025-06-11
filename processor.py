import os
import pandas as pd
import random
from datetime import datetime, timedelta

class ChipsCSVProcessor:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.df = pd.read_csv(csv_path)

    # Function to create a new filename based on Brand and Taste
    def create_new_filename(self, brand, taste, original_path):
        if pd.isna(taste):
            taste = 'Unknown'
        if pd.isna(brand):
            brand = 'Unknown'
        new_name = f"{brand}_{taste}".replace(" ", "_").replace("?", "Unknown").lower() + os.path.splitext(original_path)[1]
        return new_name

    # Helper method to ensure unique filenames
    def get_unique_filename(self, directory, base_filename):
        filename, extension = os.path.splitext(base_filename)
        counter = 1
        
        # Check if the file already exists
        new_filename = f"{filename}{extension}"
        while os.path.exists(os.path.join(directory, new_filename)):
            # Increment the suffix each time a conflict is found
            new_filename = f"{filename}_{counter}{extension}"
            counter += 1
            
        return new_filename

    # Function to rename files and update the CSV
    def rename_files(self):
        for index, row in self.df.iterrows():
            original_path = row['Pic']
            if "IMG_" in os.path.basename(original_path):
                brand = row['Brand']
                taste = row['Taste']
                new_filename = self.create_new_filename(brand, taste, original_path)
                directory = os.path.dirname(original_path)
                
                # Use the helper function to ensure unique filename
                unique_filename = self.get_unique_filename(directory, new_filename)
                new_path = os.path.join(directory, unique_filename)

                try:
                    os.rename(original_path, new_path)
                    print(f"Renamed: {original_path} -> {new_path}")
                    self.df.at[index, 'Pic'] = new_path
                except FileNotFoundError:
                    print(f"File not found: {original_path}")
                except Exception as e:
                    print(f"Error renaming {original_path}: {e}")
            else:
                print(f"Skipping: {original_path} (already renamed)")

        # Save the updated DataFrame to the CSV file
        self.df.to_csv(self.csv_path, index=False)
        print("Renaming and CSV update complete.")


    # Function to generate random dates for rows with 'x' in Date column
    def replace_placeholder_dates(self, start_date_str, end_date_str):
        start_date = datetime.strptime(start_date_str, "%Y/%m/%d")
        end_date = datetime.strptime(end_date_str, "%Y/%m/%d")

        def generate_random_date(start_date, end_date):
            delta = end_date - start_date
            random_days = random.randint(0, delta.days)
            return (start_date + timedelta(days=random_days)).strftime("%d/%m/%Y")

        # Replace 'x' in the Date column with a random date
        self.df['Date'] = self.df['Date'].apply(lambda x: generate_random_date(start_date, end_date) if x == 'x' else x)

        # Save the updated DataFrame to the CSV file
        self.df.to_csv(self.csv_path, index=False)
        print("Placeholder dates replaced and CSV updated.")

csv_processor = ChipsCSVProcessor('chips.csv')

# Call rename_files function
csv_processor.rename_files()

# Call replace_placeholder_dates function
csv_processor.replace_placeholder_dates('2025/06/01', '2025/06/11')