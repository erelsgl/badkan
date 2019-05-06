public class TestMaxSum {
	
	public static void main(String[] args) {
		int size = MyConsole.readInt("please input a size of you array.");
		int arr[] = getArray(size);
		System.out.println("The max sum of your array is : " +maxSum(arr));
		
	}
	
	public static int[] getArray(int size){ // This function allows to generate an array
		int arr[] = new int [size]; // We create a new array
		for(int a = 0; a < size; a++){
			int b = MyConsole.readInt("Please input a number :"); // We fill the new array
			arr[a] = b;
		}
		return arr;
	}

	public static int maxSum(int [] arr){ 
		// This function allows to know the sum of the biggest part of the array
		int sum = 0;
		int sum2 = 0;
		int sum3 = 0;
		for(int a = 0; a< arr.length; a++){	
			for(int b = a; b < arr.length; b++){ 
				// We use two "for" to generate all the possibilities inside the array (thanks to int b = a)
				sum = sum + arr[b];
				if(sum2 < sum){ // We compare the new possibility with the old inside the "for b"
					sum2 = sum;
				}
			}
			if(sum3 < sum2){ // We compare the new possibility with the old outside the "for b"
				sum3 = sum2;
			}
		sum = 0;
		sum2 = 0;
		}
		return sum3;
	}
	
	
	public static void printArray(int[]array){ // This function allows to print the array
		for(int a = 0; a < array.length; a++){
			System.out.println(array[a]);
		}
	}
	
}
