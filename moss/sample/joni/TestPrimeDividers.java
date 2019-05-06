public class TestPrimeDividers {

	public static void main(String[] args) {
		long n = MyConsole.readInt("Please input n :");
		System.out.println("Is your number a prime ? " +isPrime(n));
		long [] arr = primeDividers(n);
		System.out.println("Your number is divisible by this/these number(s) :");
		printArray(arr);
	}
	
	public static boolean isPrime(long n){ // This function allows to know if the number is a prime
		long b = 0;
		for(int a = 2; a <= Math.sqrt(n); a++){ // We use the square root because a theorem said it suffice to count until the square root to know if a number is a prime
			b = n % a;
			if(b == 0){ // if the is not rest, that's means, if the number is divisible and so, not a prime
				return false;
			}
		}
		return true;		
	}
	
	public static long[] primeDividers(long n){ // This function allows to know by which number the number we input is divisible
		long b = 0;
		int count = 0;
		for(int a = 2; a < n; a++){ // We need to know the size of the array
			b = n % a;
			if(b == 0){
				count = count + 1; // This is a size of the array
			}
		}
		long [] arr = new long [count]; // We create the array
		int z = 0;
		for(int c = 2; c < n; c++){
			b = n % c;
			if(b == 0){ // Like in the function "isPrime", but here, we note the number "c" in the array
				arr[z] = c;
				z = z + 1;
			}
		}
		return arr;
	}
	
	public static void printArray(long [] arr){ // This function allows to print the array
		for(int a = 0; a < arr.length; a++){
			System.out.println(arr[a]);
		}
	}
	
}
