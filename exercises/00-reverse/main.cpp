#include "reverse.h"
#include <iostream>
using namespace std;

int rightCount=0, wrongCount=0;

void check(string name, string input, string expected) {
	string output = reverse(input);
	cout << name << ": your output=" << output << ", expected output=" << expected << endl;
	if  (output==expected) 
		rightCount++;
	else
		wrongCount++;
}

int main() {
	check("Case 1", "abc", "cba");
	check("Case 2", "xyzyx", "xyzyx");
	int grade = 100*rightCount / (rightCount+wrongCount);
	cout << "*** Right: " << rightCount << ". Wrong: " << wrongCount << ". Grade: " << grade << "% ***" << endl;
}
