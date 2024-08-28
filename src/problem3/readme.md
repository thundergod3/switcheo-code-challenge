# List out the computational inefficiencies and anti-patterns found in the code block below.

1. Props: Remove the children from props since it's unused

2. prices state: prices state should have type Record<string, number>

3. getPrices: console.err is not correct, it should be console.error

4. getPriority: 
      - getPriority should stay out of component, otherwise, we should memoize it
      - getPriority blockchain type should be of union or enum instead of any

6. WalletBalance interface: miss the blockchain type

7. sortedBalances: 
      - add fallback for sort function
      - redundant dependency prices

8. rows: memoize and use formattedBalances instead of sortedBalances 

9. prices.[balance.currency]: Provide fallback value once prices is undefined

10. Do not use index for key