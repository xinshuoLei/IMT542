<h2>
  <p> I4 Easy to Access: </p>
  <span> Find 3 different information structures with different access technologies</span>
</h2>


Xinshuo Lei

### Overview

The [notebook](https://github.com/xinshuoLei/IMT542/blob/I4/IMT542_I4.ipynb) includes functions for the following three access technologies:

> The pros and cons of each access technology are included as comments in the notebook.

**Access technology 1:** 

- Access live webpage content through an embedded iframe

**Access technology 2:** 

- Access structured university data via an API connection over HTTP

- Data source: [University Domains and Names API](https://github.com/Hipo/university-domains-list)

**Access technology 3:**

- Access a CSV file that has been manually downloaded and stored locally using pandas

- A simple example CSV file can be downloaded using this link: [CSV File with Passwords and Recovery Codes for Email Onboarding](https://support.staffbase.com/hc/en-us/article_attachments/360009197091/email-password-recovery-code.csv)

- The above file is also included in the repository: [username-password-recovery-code.csv](https://github.com/xinshuoLei/IMT542/blob/I4/username-password-recovery-code.csv)



### Running the code
**Option 1: Run on Google Colab (Recommended)**
1. Download the notebook: [IMT542_I4.ipynb](https://github.com/xinshuoLei/IMT542/blob/I4/IMT542_I4.ipynb)

2. Go to [Google Colab](https://colab.research.google.com/)

3. Click **"File" → "Upload notebook"**

4. Upload and run the notebook directly in your browser
   
**Option 2: Run Locally**

1. Install Jupyter Notebook by following [the official installation guide](https://jupyter.org/install)

2. Run the notebook with the following command:
   
    ```
    jupyter notebook IMT542_I4.ipynb
    ```


    > The notebook already includes a setup cell that installs all necessary dependencies.  
You don't need to install anything manually. Just run the cells in order.

    
### Usage 

Once the notebook is running, use the following function for each access technology:

**Access technology 1**: 

```python
display_webpage_iframe(url, width, height)
```

**Access technology 2**: 

```python
get_university_information_via_API(country, university_name)
```

**Access technology 3**: 

```python
read_local_csv_file()
```

Example code for each, along with a sample of accessed information, is included in the notebook.