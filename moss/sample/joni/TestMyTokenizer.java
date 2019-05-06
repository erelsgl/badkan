public class TestMyTokenizer {
	public static void main(String[] args) {
		String s = MyConsole.readString("Please input a String : ");
		String tok = MyConsole.readString("Please input a String : ");
		String z [] = myTokenizer (s, tok);
		System.out.println("The new sentence is :");
		printArray(z);
		
	}
	
	public static String[] myTokenizer (String s, String tok){ // This function allows to sort the sentence and to take of the punctuation
		String [] str = tok.split(""); // We use the method "split" to sort all the character inside an array
		String [] str2 = s.split("");
		boolean count = false;
		boolean count2 = false;
		boolean count3 = true;
		for(int a = 0; a < str2.length; a++){ // We use to "for" to generate all the possibilities between the both array
			for(int b = 0; b < str.length; b++){
				if(str2[a].equals(str[b])){ // We use "equals" to compare the two character
					count = true;
				}
			}
			if(count == false){
				if(count3 == true){
					int d = a;
					str2[0] = str2[d];
				}
				if(count3 == false){
				str2[0] = str2[0] +  str2[a]; // The "+" allows to add the two elements together
				count2 = false;	
				}
				count3 = false;
			}
			if(count == true && count2 == false){
				count2 = true;
				str2[0] = str2[0] + "/"; // We note "/" to separate all the words
			}
		count = false;
		}
		String [] str3 = str2[0].split("/"); // We separate all the words
		return str3;
	}
	
	public static void printArray(String[] arr){ // This function allows to print the array
		for(int a = 0; a < arr.length; a++){
			System.out.print(arr[a] + " "); 
		}
	}

}
 