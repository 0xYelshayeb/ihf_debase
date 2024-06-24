import pandas as pd
import matplotlib.pyplot as plt

# Read the CSV file into a dataframe
df = pd.read_csv('holders.csv')

# Clean up the Balance column to convert it to numeric
df['Balance'] = df['Balance'].str.replace(',', '').astype(float)

# Calculate the cumulative balance
df['CumulativeBalance'] = df['Balance'].cumsum()

# append 0 to the beginning of the cumulative balance
df['CumulativeBalance'] = df['CumulativeBalance'].shift(1)
df['CumulativeBalance'].iloc[0] = 0

# Debug: cumulative 300 / last cumulative
print(df['CumulativeBalance'][300]/df['CumulativeBalance'].iloc[-1])

# Plotting the cumulative balance with enhancements
plt.figure(figsize=(12, 8))
plt.plot(df['CumulativeBalance'][2:500], marker='o', linestyle='-', color='b', markersize=5, linewidth=1)
plt.xlabel('Index')
plt.ylabel('Cumulative Balance')
plt.title('Cumulative Balance of Tokens')
# plt.yscale('log')  # Use a logarithmic scale if the data varies widely
plt.grid(True, which="both", linestyle='--', linewidth=0.5)
plt.tight_layout()  # Ensures that labels fit into the plot area
plt.show()
