// sampleProblems.ts
export const sampledpData = {
    title: "Climbing Stairs",
    description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    tags: ["Dynamic Programming", "Math", "Memoization"],
    constraints: "1 <= n <= 45",
    hints:
        "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
    editorial:
        "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
    testCases: [
        { input: "2", output: "2" },
        { input: "3", output: "3" },
        { input: "4", output: "5" },
    ],
    examples: {
        JAVASCRIPT: {
            input: "n = 2",
            output: "2",
            explanation: "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
        },
        PYTHON: {
            input: "n = 3",
            output: "3",
            explanation: "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
        },
        JAVA: {
            input: "n = 4",
            output: "5",
            explanation: "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
        },
    },
    codeSnippets: {
        JAVASCRIPT: `function climbStairs(n) {\n  // Write your code here\n}`,
        PYTHON: `class Solution:\n  def climbStairs(self, n: int) -> int:\n      # Write your code here\n      pass`,
        JAVA: `public class Main {\n  public int climbStairs(int n) {\n      // Write your code here\n      return 0;\n  }\n}`,
    },
    referenceSolutions: {
        JAVASCRIPT: `function climbStairs(n) {\n  if(n <= 2) return n;\n  let dp = [0,1,2];\n  for(let i=3;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];\n  return dp[n];\n}`,
        PYTHON: `class Solution:\n  def climbStairs(self, n: int) -> int:\n      if n <= 2: return n\n      dp = [0]*(n+1)\n      dp[1], dp[2] = 1,2\n      for i in range(3,n+1): dp[i]=dp[i-1]+dp[i-2]\n      return dp[n]`,
        JAVA: `public class Main {\n  public int climbStairs(int n) {\n      if(n<=2) return n;\n      int[] dp=new int[n+1]; dp[1]=1; dp[2]=2;\n      for(int i=3;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];\n      return dp[n];\n  }\n}`,
    },
};

export const sampleStringProblem = {
    title: "Valid Palindrome",
    description:
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
    difficulty: "EASY",
    tags: ["String", "Two Pointers"],
    constraints:
        "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
    hints:
        "Consider using two pointers, one from the start and one from the end, moving towards the center.",
    editorial:
        "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
    testCases: [
        { input: "A man, a plan, a canal: Panama", output: "true" },
        { input: "race a car", output: "false" },
        { input: " ", output: "true" },
    ],
    examples: {
        JAVASCRIPT: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        PYTHON: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        JAVA: {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
    },
    codeSnippets: {
        JAVASCRIPT: `function isPalindrome(s) {\n  // Write your code here\n}`,
        PYTHON: `class Solution:\n  def isPalindrome(self, s: str) -> bool:\n      # Write your code here\n      pass`,
        JAVA: `public class Main {\n  public static boolean isPalindrome(String s) {\n      // Write your code here\n      return false;\n  }\n}`,
    },
    referenceSolutions: {
        JAVASCRIPT: `function isPalindrome(s){ s=s.toLowerCase().replace(/[^a-z0-9]/g,''); let l=0,r=s.length-1; while(l<r){if(s[l]!==s[r])return false;l++;r--;} return true; }`,
        PYTHON: `class Solution:\n  def isPalindrome(self, s: str) -> bool:\n      s = [c.lower() for c in s if c.isalnum()]\n      return s == s[::-1]`,
        JAVA: `public class Main {\n  public static boolean isPalindrome(String s){\n      s=s.replaceAll("[^a-zA-Z0-9]","").toLowerCase();\n      int l=0,r=s.length()-1;\n      while(l<r){if(s.charAt(l)!=s.charAt(r))return false;l++;r--;} return true;\n  }\n}`,
    },
};
