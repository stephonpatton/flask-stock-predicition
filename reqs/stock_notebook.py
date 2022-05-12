#!/usr/bin/env python
# coding: utf-8

# In[2]:


# !pipreqs --force
# !pip install -r requirements.txt
#
get_ipython().system('pip install tensorflow yfinance pandas sklearn')
# import tensorflow as tf
# !pip install yfinance


# In[ ]:


import yfinance as yf
import pandas as pd
import tensorflow as tf
print("Hello")


# In[1]:



get_ipython().system('pip freeze > requirements.txt')


# In[3]:


# !pip freeze > requirements.txt
from datetime import datetime, timedelta
end_date = datetime.today().strftime('%Y-%m-%d')
start_date_dt = datetime.now() - timedelta(days=10*365)
print(start_date_dt)
start_date = start_date_dt.strftime('%Y-%m-%d')
print(start_date)
print(end_date)
# aapl = yf.download("AAPL")
aapl = yf.download("AAPL", start = start_date, end = end_date)
# aapl_history = aapl.history(period="max")


# In[3]:





# In[4]:


type(aapl)
df = pd.DataFrame(aapl)
df
df1 = df.reset_index()['Close']
df1


# In[5]:


import matplotlib.pyplot as plt
plt.plot(df1)


# In[6]:


import numpy as np
from sklearn.preprocessing import MinMaxScaler
scaler=MinMaxScaler(feature_range=(0,1))
df1 = scaler.fit_transform(np.array(df1).reshape(-1, 1))


# In[9]:


# Split data 
train_size = int(len(df1)*.95) # 65% 
test_size = len(df1) - train_size
train, test = df1[0:train_size,:], df1[train_size:len(df1), :1]


# In[10]:


print(train_size)
print(test_size)
# print(train)
# print(test)


# In[11]:


def create_dataset(data, time_step=1):
    dataX, dataY = [], []
    for i in range(len(data)-time_step-1):
        a = data[i:(i+time_step), 0]
        dataX.append(a)
        dataY.append(data[i + time_step, 0])
    return np.array(dataX), np.array(dataY)


# In[12]:


time_step = 100
X_train, y_train = create_dataset(train, time_step)
X_test, y_test = create_dataset(test, time_step)


# In[13]:


print(X_train.shape), print(y_train.shape)


# In[14]:


print(X_test.shape), print(y_test.shape)


# In[15]:


# Reshape to be inputted into LSTM 
X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
print(X_train.shape)
print(X_test.shape)


# In[16]:


# Create Stacked LSTM
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import Dropout 
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(100, 1)))
model.add(Dropout(.5))
model.add(LSTM(50, return_sequences=True))
model.add(LSTM(50, return_sequences=True))
model.add(LSTM(50))
model.add(Dense(1))
model.compile(loss='mean_squared_error', optimizer='adam')


# In[17]:


model.summary()


# In[18]:


model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=100, batch_size=250, verbose=1)


# In[19]:


# import tensorflow as tf
tf.__version__


# In[20]:


prediction = model.predict(X_train)
test_prediction = model.predict(X_test)
print(model.input)


# In[21]:


prediction = scaler.inverse_transform(prediction)
test_prediction = scaler.inverse_transform(test_prediction)


# In[22]:


import math
from sklearn.metrics import mean_squared_error
math.sqrt(mean_squared_error(y_train, prediction))


# In[23]:


math.sqrt(mean_squared_error(y_test, test_prediction))


# In[24]:


### Plotting 
# shift train predictions for plotting
look_back=100
trainPredictPlot = np.empty_like(df1)
trainPredictPlot[:, :] = np.nan
trainPredictPlot[look_back:len(prediction)+look_back, :] = prediction
# shift test predictions for plotting
testPredictPlot = np.empty_like(df1)
testPredictPlot[:, :] = np.nan
testPredictPlot[len(prediction)+(look_back*2)+1:len(df1)-1, :] = test_prediction
# plot baseline and predictions
plt.plot(scaler.inverse_transform(df1))
plt.plot(trainPredictPlot)
plt.plot(testPredictPlot)
plt.show()


# In[25]:


len(test)


# In[26]:


x_input = test[len(test)-100:].reshape(1, -1)
x_input.shape


# In[27]:


temp_input = list(x_input)
temp_input = temp_input[0].tolist()


# In[28]:


# temp_input


# In[29]:


# demonstrate prediction for next 10 days
from numpy import array

lst_output=[]
n_steps=100
i=0
while(i<30):
    
    if(len(temp_input)>100):
        #print(temp_input)
        x_input=np.array(temp_input[1:])
        print("{} day input {}".format(i,x_input))
        x_input=x_input.reshape(1,-1)
        x_input = x_input.reshape((1, n_steps, 1))
        #print(x_input)
        yhat = model.predict(x_input, verbose=0)
        print("{} day output {}".format(i,yhat))
        temp_input.extend(yhat[0].tolist())
        temp_input=temp_input[1:]
        #print(temp_input)
        lst_output.extend(yhat.tolist())
        i=i+1
    else:
        x_input = x_input.reshape((1, n_steps,1))
        yhat = model.predict(x_input, verbose=0)
#         print(yhat[0])
        temp_input.extend(yhat[0].tolist())
#         print(len(temp_input))
        lst_output.extend(yhat.tolist())
        i=i+1
    

# print(lst_output)


# In[30]:


day_new=np.arange(1,101)
day_pred=np.arange(101,131)


# In[31]:


len(df1)
print(scaler.inverse_transform(df1[-1:]))
print(scaler.inverse_transform(lst_output[0:]))


# In[32]:


plt.plot(day_new,scaler.inverse_transform(df1[len(df1)-100:]))
plt.plot(day_pred,scaler.inverse_transform(lst_output))


# In[33]:


df3=df1.tolist()
df3.extend(lst_output)
plt.plot(df3[1200:])


# In[34]:


df3=scaler.inverse_transform(df3).tolist()


# In[35]:


plt.plot(df3)


# In[37]:


import pickle

# filename = 'model.sav'
# pickle.dump(model, open(filename, 'wb'))
tf.keras.models.save_model(model, "filename.pkl")
# import time
# #save model
# ts = int(time.time())
# file_path = f"tf-models/lstm/{ts}/"
# model.save(filepath=file_path, save_format='tf')


# In[ ]:


# import tarfile
# import os

# def tar_folder(output_filename: str, source_dir: str):
#     with tarfile.open(output_filename, "w:gz") as tar:
#         tar.add(source_dir, arcname=os.path.basename(source_dir))

# OUT_FILE = 'tf-models-lstm.tar.gz'

# SOURCE_FILE = "tf-models"

# tar_folder(output_filename=OUT_FILE, source_dir=SOURCE_FILE)
# print(OUT_FILE)


# In[ ]:


# import sagemaker

# sagemaker_session = sagemaker.Session(default_bucket='stocks-models')
# upload_data = sagemaker_session.upload_data(path='tf-models-lstm.tar.gz', key_prefix='my_prefix')

# print('upload_data : {}'.format(upload_data))


# In[ ]:


print(prediction[:50])


# In[ ]:




