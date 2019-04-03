#include "reverse.h"
#include <algorithm>
using namespace std;

string reverse(string input) {
    string inputcopy(input);
	reverse(inputcopy.begin(), inputcopy.end());
	return inputcopy;
}
