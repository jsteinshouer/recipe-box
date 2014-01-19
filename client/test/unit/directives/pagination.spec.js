describe('pagination directive', function () {
  var $scope, element, buttons;
  beforeEach(module('directives.pagination'));
  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    $scope.numPages = 5;
    $scope.currentPage = 3;
    element = $compile('<pagination num-pages="numPages" current-page="currentPage" on-select-page="selectPageHandler(page)"></pagination>')($scope);
    $scope.$digest();
    buttons = function() { return element.find('button'); };
  }));

  it('has a "pagination" css class', function() {
    expect(element.hasClass('btn-group')).toBe(true);
  });

  it('contains one div and num-pages + 2 li elements', function() {
    expect(buttons().length).toBe(7);
    expect(buttons().eq(0).text()).toBe('Previous');
    expect(buttons().eq(-1).text()).toBe('Next');
  });

  it('has the number of the page as text in each page item', function() {
    for(var i=1; i<=$scope.numPages;i++) {
      expect(buttons().eq(i).text()).toEqual(''+i);
    }
  });

  it('sets the current-page to be active', function() {
    var currentPageItem = buttons().eq($scope.currentPage);
    expect(currentPageItem.hasClass('active')).toBe(true);
  });

  it('disables the "previous" link if current-page is 1', function() {
    $scope.currentPage = 1;
    $scope.$digest();
    var previousPageItem = buttons().eq(0);
    expect(previousPageItem.hasClass('disabled')).toBe(true);
  });

  it('disables the "next" link if current-page is num-pages', function() {
    $scope.currentPage = 5;
    $scope.$digest();
    var nextPageItem = buttons().eq(-1);
    expect(nextPageItem.hasClass('disabled')).toBe(true);
  });

  it('changes currentPage if a page link is clicked', function() {
    var page2 = buttons().eq(2);
    page2.click();
    $scope.$digest();
    expect($scope.currentPage).toBe(2);
  });

  it('changes currentPage if the "previous" link is clicked', function() {
    var previous = buttons().eq(0);
    previous.click();
    $scope.$digest();
    expect($scope.currentPage).toBe(2);
  });

  it('changes currentPage if the "next" link is clicked', function() {
    var next = buttons().eq(-1);
    next.click();
    $scope.$digest();
    expect($scope.currentPage).toBe(4);
  });

  it('does not change the current page on "previous" click if already at first page', function() {
    var previous = buttons().eq(0).find('a').eq(0);
    $scope.currentPage = 1;
    $scope.$digest();
    previous.click();
    $scope.$digest();
    expect($scope.currentPage).toBe(1);
  });

  it('does not change the current page on "next" click if already at last page', function() {
    var next = buttons().eq(-1).find('a').eq(0);
    $scope.currentPage = 5;
    $scope.$digest();
    next.click();
    $scope.$digest();
    expect($scope.currentPage).toBe(5);
  });

  it('executes the onSelectPage expression when the current page changes', function() {
    $scope.selectPageHandler = jasmine.createSpy('selectPageHandler');
    $scope.$digest();
    var page2 = buttons().eq(2);
    page2.click();
    $scope.$digest();
    expect($scope.selectPageHandler).toHaveBeenCalledWith(2);
  });

  it('changes the number of items when numPages changes', function() {
    $scope.numPages = 8;
    $scope.$digest();
    expect(buttons().length).toBe(10);
    expect(buttons().eq(0).text()).toBe('Previous');
    expect(buttons().eq(-1).text()).toBe('Next');
  });

  it('sets the current page to the last page if the numPages is changed to less than the current page', function() {
    $scope.selectPageHandler = jasmine.createSpy('selectPageHandler');
    $scope.$digest();
    $scope.numPages = 2;
    $scope.$digest();
    expect(buttons().length).toBe(4);
    expect($scope.currentPage).toBe(2);
    expect($scope.selectPageHandler).toHaveBeenCalledWith(2);
  });
});